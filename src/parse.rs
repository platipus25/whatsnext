//use crate::{Period, Schedule, ScheduleId, SpecialDay};
use chrono::{Duration, NaiveDate, NaiveTime, Weekday};
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
    use serde::{self, Deserialize, Deserializer, Serializer};

    pub const FORMAT: &'static str = "%-m/%-d/%Y";

    // The signature of a serialize_with function must follow the pattern:
    //
    //    fn serialize<S>(&T, S) -> Result<S::Ok, S::Error>
    //    where
    //        S: Serializer
    //
    // although it may also be generic over the input types T.
    pub fn serialize<S>(date: &NaiveDate, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let s = format!("{}", date.format(FORMAT));
        serializer.serialize_str(&s)
    }

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
