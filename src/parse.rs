//use crate::{Period, Schedule, ScheduleId, SpecialDay};
use chrono::{Duration, NaiveDate, NaiveDateTime, Weekday};
use core::fmt;
use serde::Deserialize;

/*struct WhatsnextFormat {
    HashMap<KeyType, >
}

enum KeyType {
    ScheduleId(ScheduleId),
    Weekday(Weekday),
    SpecialDay(NaiveDate),
}
struct WhatsnextFormat {
    monday: Schedule
    tuesday: Schedule
    wednesday: Schedule
    thursday: Schedule
    friday: Schedule
    saturday: Schedule
    sunday: Schedule

    #[serde(flatten)]
    extra: HashMap<String, Schedule>,
}

*/
#[derive(Deserialize, Debug)]
pub struct SchoolEntry {
    #[serde(rename = "n")]
    pub name: String,
    pub id: String,
}

pub mod periods_io {
    use crate::parse::{hour_minute, month_day_year_slashes};
    use crate::parse::{DaysBetweenIter, WeekdayIter};
    use crate::{Period, Schedule, ScheduleId, School, SpecialDay};
    use chrono::{NaiveDate, NaiveTime, Weekday};
    use serde::Deserialize;
    use std::collections::HashMap;

    // schedule.yaml
    #[derive(Deserialize, Debug)]
    pub struct PeriodsCalendar {
        defaults: Defaults,
        calendar: Vec<CalendarEntry>,
    }

    #[derive(Deserialize, Debug)]
    pub struct CalendarEntry {
        content: Content,
        #[serde(with = "month_day_year_slashes", rename = "from", alias = "date")]
        start: NaiveDate,
        #[serde(default)]
        #[serde(with = "month_day_year_slashes::option", rename = "to")]
        end: Option<NaiveDate>,
    }

    #[derive(Deserialize, Debug)]
    struct Content {
        #[serde(rename = "n")]
        name: Option<String>,
        #[serde(rename = "t")]
        schedule: ScheduleId,
    }

    #[derive(Deserialize, Debug)]
    pub struct Defaults {
        #[serde(with = "month_day_year_slashes")]
        start: NaiveDate,
        pattern: Vec<ScheduleId>,
    }

    // school.yaml
    #[derive(Deserialize, Debug)]
    pub struct PeriodsSchool {
        pub periods: Vec<String>,
        #[serde(rename = "nonPeriods")]
        pub non_periods: Vec<String>,
        #[serde(rename = "presets")]
        schedules: HashMap<ScheduleId, PeriodsSchedule>,
    }

    #[derive(Deserialize, Debug)]
    pub struct PeriodsSchedule {
        #[serde(rename = "n")]
        name: String,
        #[serde(rename = "s")]
        schedule: Option<Vec<PartialClass>>,
    }

    #[derive(Deserialize, Debug)]
    pub struct PartialClass {
        #[serde(rename = "f", with = "hour_minute")]
        start: NaiveTime,
        #[serde(rename = "n")]
        name: String,
    }

    pub fn to_school(school: PeriodsSchool, calendar: PeriodsCalendar) -> School {
        let weekdays = HashMap::from_iter(
            WeekdayIter::new(Weekday::Sun).zip(calendar.defaults.pattern.into_iter()),
        );

        let mut special_days = Vec::new();
        for entry in calendar.calendar.into_iter() {
            for date in DaysBetweenIter::new(entry.start, entry.end) {
                special_days.push((
                    date,
                    SpecialDay {
                        name: entry.content.name.clone(),
                        schedule: entry.content.schedule.clone(),
                    },
                ));
            }
        }
        let special_days = HashMap::from_iter(special_days.into_iter());
        let schedules = HashMap::from_iter(
            school
                .schedules
                .into_iter()
                .map(|entry| (entry.0, entry.1.into())),
        );

        School {
            periods: [school.periods, school.non_periods].concat(),
            schedules,
            weekdays,
            special_days,
        }
    }

    impl From<PeriodsSchedule> for Schedule {
        fn from(periods_schedule: PeriodsSchedule) -> Self {
            let mut periods = Vec::<Period>::new();

            let schedule = periods_schedule.schedule.unwrap_or_default();
            let iter = &mut schedule.iter().peekable();
            while let Some(first) = iter.next() {
                let end = iter.peek().unwrap_or(&first);
                periods.push(Period {
                    name: first.name.clone(),
                    start: first.start,
                    end: end.start,
                });
            }

            let periods = periods
                .into_iter()
                .filter(|period| period.name != "Free")
                .collect();

            Schedule {
                name: periods_schedule.name,
                periods,
            }
        }
    }
}

pub mod bell_plus {
    use crate::parse::DaysBetweenIter;
    use crate::parse::{hour_minute, month_day_year_slashes};
    use crate::sources::SchoolId;
    use crate::{Period, Schedule, ScheduleId, School, SpecialDay};
    use chrono::{NaiveDate, NaiveTime, Weekday};
    use lazy_regex::regex;
    use serde::Deserialize;
    use std::collections::HashMap;

    //https://bell.plus/api/sources

    #[derive(Deserialize, Debug)]
    pub struct BellSource {
        meta: BellSchoolEntry,
        correction: String,
        #[serde(rename = "calendar")]
        calendar_blob: String,
        #[serde(rename = "schedules")]
        schedules_blob: String,
    }

    struct ParsedBellSource {
        meta: BellSchoolEntry,
        correction: Option<i32>,
        calendar: BellCalendar,
        schedules: Vec<BellSchedule>,
    }

    #[derive(Deserialize, Debug)]
    pub struct BellSchoolEntry {
        name: String,
        periods: Vec<String>,
        id: Option<ScheduleId>,
    }

    #[derive(Debug)]
    struct BellSchedule {
        name: String,
        id: ScheduleId,
        periods: Vec<BellPeriod>,
    }

    #[derive(Debug)]
    struct BellPeriod {
        start: NaiveTime,
        name: String,
    }

    #[derive(Debug)]
    struct BellCalendar {
        default_week: HashMap<Weekday, ScheduleId>,
        special_days: Vec<BellSpecialDay>,
    }

    #[derive(Debug)]
    struct BellSpecialDay {
        start: NaiveDate,
        end: Option<NaiveDate>,
        id: ScheduleId,
        name: Option<String>,
    }

    pub fn to_school(source: BellSource) -> School {
        let source: ParsedBellSource = source.into();
        let mut schedules = HashMap::<ScheduleId, Schedule>::new();
        let mut special_days = HashMap::<NaiveDate, SpecialDay>::new();

        for schedule in source.schedules {
            let id = schedule.id.clone();
            schedules.insert(id, schedule.into());
        }

        for bell_special_day in source.calendar.special_days {
            for day in
                DaysBetweenIter::new(bell_special_day.start.clone(), bell_special_day.end.clone())
            {
                special_days.insert(
                    day,
                    SpecialDay {
                        name: bell_special_day.name.clone(),
                        schedule: bell_special_day.id.clone(),
                    },
                );
            }
        }

        School {
            periods: source.meta.periods,
            weekdays: source.calendar.default_week,
            schedules,
            special_days,
        }
    }

    impl From<BellSchedule> for Schedule {
        fn from(bell_schedule: BellSchedule) -> Self {
            let mut periods = Vec::<Period>::new();

            let iter = &mut bell_schedule.periods.iter().peekable();
            while let Some(first) = iter.next() {
                let end = iter.peek().unwrap_or(&first);
                periods.push(Period {
                    name: first.name.clone(),
                    start: first.start,
                    end: end.start,
                });
            }

            let periods = periods
                .into_iter()
                .filter(|period| !period.name.contains("Passing to"))
                .collect();

            Schedule {
                name: bell_schedule.name,
                periods,
            }
        }
    }

    impl From<BellSource> for ParsedBellSource {
        fn from(bell_source: BellSource) -> Self {
            println!("{:?}", bell_source);

            let calendar = parse_calendar(bell_source.calendar_blob);
            let schedules = parse_schedules(bell_source.schedules_blob);

            ParsedBellSource {
                meta: bell_source.meta,
                correction: bell_source.correction.parse().ok(),
                calendar,
                schedules,
            }
        }
    }

    fn parse_calendar(source: String) -> BellCalendar {
        //let lines = source.lines().peekable();

        let weekday_regex =
            regex!(r"(?P<weekday>Mon|Tue|Wed|Thu|Fri|Sat|Sun) (?P<schedule>[a-z-]+)");
        let mut default_week = HashMap::new();

        for day in weekday_regex.captures_iter(&source) {
            let weekday = day.name("weekday").unwrap().as_str().parse::<Weekday>();

            // TODO: give a nicer error
            let weekday = weekday.unwrap();

            let id = day.name("schedule").unwrap().as_str().to_string();

            default_week.insert(weekday, id);
        }

        let mut special_days = Vec::new();
        let special_day_regex = regex!(r#"
        (?P<start>\d{2}/\d{2}/\d{4})
        -?
        (?P<end>\d{2}/\d{2}/\d{4})?
        \x20
        (?P<id>[a-z-]+)
        (?:\x20\#\x20)?
        (?P<name>[0-9a-zA-Z',\x20]+)?"#x);

        for special_day in special_day_regex.captures_iter(&source) {
            let start = special_day.name("start").unwrap().as_str();
            let end = special_day.name("end").map(|cap| cap.as_str());

            let start = NaiveDate::parse_from_str(start, month_day_year_slashes::FORMAT).unwrap();
            let end = end.and_then(|end| {
                NaiveDate::parse_from_str(end, month_day_year_slashes::FORMAT).ok()
            });

            special_days.push(BellSpecialDay {
                start,
                end,
                id: special_day.name("id").unwrap().as_str().to_string(),
                name: special_day.name("name").map(|cap| cap.as_str().to_string()),
            })
        }

        BellCalendar {
            default_week,
            special_days,
        }
    }

    fn parse_schedules(source: String) -> Vec<BellSchedule> {
        let heading_regex = regex!(r"\* (?P<id>[a-z-]+) # (?P<name>[a-zA-Z0-9/\- ]+)");
        let period_regex = regex!(r"(?P<time>\d+:\d+) (?P<name>.+)+");
        //r"(?P<time>\d+:\d+) (?:(?P<passing>[a-zA-Z0-9 ]+)?(?:{(?P<normal_period_name>[a-zA-Z0-9 {}\/,\-]+)}))?(?P<name>[a-zA-Z0-9 \/,\-]+)*"

        let mut headings_iter = heading_regex.captures_iter(&source).peekable();
        let mut schedules = Vec::new();

        while let Some(heading) = headings_iter.next() {
            let section_end = headings_iter
                .peek()
                .and_then(|next_capture| next_capture.get(0))
                .map(|next| next.start())
                .unwrap_or(source.len());
            let section_start = heading.get(0).unwrap().end();

            let section = source.get(section_start..section_end).unwrap();
            let mut periods = Vec::new();

            for period in period_regex.captures_iter(section) {
                let name = period.name("name").unwrap().as_str();
                let name = regex!(r"[{}]").replace_all(name, "").into_owned();

                periods.push(BellPeriod {
                    start: NaiveTime::parse_from_str(
                        period.name("time").unwrap().as_str(),
                        hour_minute::FORMAT,
                    )
                    .unwrap(),
                    name,
                });
            }

            schedules.push(BellSchedule {
                name: heading.name("name").unwrap().as_str().to_string(),
                id: heading.name("id").unwrap().as_str().to_string(),
                periods,
            });
        }

        schedules
    }
}

/*pub enum ParseError {
    MissingPart(String),
    TimeError(chrono::ParseError),
}

impl fmt::Display for ParseError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Self::MissingPart(s) => write!(f, "{}", s),
            Self::TimeError(parse_error) => write!(f, "{}", parse_error),
        }
    }
}

impl From<chrono::ParseError> for ParseError {
    fn from(err: chrono::ParseError) -> Self {
        Self::TimeError(err)
    }
}*/

/*impl TryFrom<String> for PartialClass {
    type Error = ParseError;

    fn try_from(string: String) -> Result<Self, Self::Error> {
        let mut parts = string.splitn(2, " ");
        let start = parts
            .next()
            .map(|s| NaiveTime::parse_from_str(s, hour_minute::FORMAT))
            .transpose()?
            .ok_or_else(|| Self::Error::MissingPart("missing time".to_string()))?
            .into();
        let name = parts
            .next()
            .ok_or_else(|| Self::Error::MissingPart("missing name".to_string()))?
            .into();

        Ok(PartialClass { name, start })
    }
}*/

/*impl TryFrom<String> for CalendarEntry {
    type Error = ParseError;

    fn try_from(string: String) -> Result<Self, Self::Error> {
        let mut parts = string.splitn(3, " ");
        let mut date_span = parts
            .next()
            .ok_or_else(|| Self::Error::MissingPart("missing date(s)".to_string()))?
            .splitn(2, "-");
        let start = date_span
            .next()
            .map(|s| NaiveDate::parse_from_str(s, month_day_year_slashes::FORMAT))
            .transpose()?
            .ok_or_else(|| Self::Error::MissingPart("missing start date".to_string()))?
            .into();
        let end = date_span
            .next()
            .map(|s| NaiveDate::parse_from_str(s, month_day_year_slashes::FORMAT))
            .transpose()?
            .into();
        let schedule = parts
            .next()
            .ok_or_else(|| Self::Error::MissingPart("missing schedule id".to_string()))?
            .into();
        let name = parts.next().map(str::to_string).into();

        Ok(CalendarEntry {
            content: Content { name, schedule },
            start,
            end,
        })
    }
}*/

impl fmt::Display for SchoolEntry {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{} - {}", &self.id, &self.name)
    }
}

mod month_day_year_slashes {
    use chrono::NaiveDate;
    use serde::{self, Deserialize, Deserializer};

    pub const FORMAT: &'static str = "%-m/%-d/%Y";

    // The signature of a serialize_with function must follow the pattern:
    //
    //    fn serialize<S>(&T, S) -> Result<S::Ok, S::Error>
    //    where
    //        S: Serializer
    //
    // although it may also be generic over the input types T.
    /*pub fn serialize<S>(date: &NaiveDate, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = format!("{}", date.format(FORMAT));
        serializer.serialize_str(&s)
    }*/

    // The signature of a deserialize_with function must follow the pattern:
    //
    //    fn deserialize<'de, D>(D) -> Result<T, D::Error>
    //    where
    //        D: Deserializer<'de>
    //
    // although it may also be generic over the output types T.
    pub fn deserialize<'de, D>(deserializer: D) -> Result<NaiveDate, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveDate::parse_from_str(&s, FORMAT).map_err(serde::de::Error::custom)
    }

    pub mod option {
        use chrono::NaiveDate;
        use serde::{self, Deserialize, Deserializer};
        pub fn deserialize<'de, D>(deserializer: D) -> Result<Option<NaiveDate>, D::Error>
        where
            D: Deserializer<'de>,
        {
            let s = String::deserialize(deserializer)?;
            Ok(Some(
                NaiveDate::parse_from_str(&s, super::FORMAT).map_err(serde::de::Error::custom)?,
            ))
        }
    }
}

mod hour_minute {
    use chrono::NaiveTime;
    use serde::{self, Deserialize, Deserializer};

    pub const FORMAT: &'static str = "%-H:%M";

    // The signature of a deserialize_with function must follow the pattern:
    //
    //    fn deserialize<'de, D>(D) -> Result<T, D::Error>
    //    where
    //        D: Deserializer<'de>
    //
    // although it may also be generic over the output types T.
    pub fn deserialize<'de, D>(deserializer: D) -> Result<NaiveTime, D::Error>
    where
        D: Deserializer<'de>,
    {
        let s = String::deserialize(deserializer)?;
        NaiveTime::parse_from_str(&s, FORMAT).map_err(serde::de::Error::custom)
    }
}

struct WeekdayIter {
    weekday: Weekday,
}

impl WeekdayIter {
    fn new(start: Weekday) -> Self {
        WeekdayIter { weekday: start }
    }
}

impl Iterator for WeekdayIter {
    type Item = Weekday;

    fn next(self: &mut Self) -> Option<Self::Item> {
        let day = self.weekday;
        self.weekday = day.succ();
        Some(day)
    }
}

struct DaysBetweenIter {
    date: NaiveDate,
    end: NaiveDate,
}

impl DaysBetweenIter {
    fn new(start: NaiveDate, end: Option<NaiveDate>) -> Self {
        DaysBetweenIter {
            date: start,
            end: end.unwrap_or_else(|| start.clone()),
        }
    }
}

impl Iterator for DaysBetweenIter {
    type Item = NaiveDate;

    fn next(self: &mut Self) -> Option<Self::Item> {
        if self.date > self.end {
            None
        } else {
            let day = self.date;
            self.date = day + Duration::days(1);
            Some(day)
        }
    }
}
