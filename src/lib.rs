use chrono::{Datelike, Duration, NaiveDate, NaiveDateTime, NaiveTime, Weekday};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, VecDeque};

pub mod parse;

#[derive(Clone, Debug, Serialize, Deserialize)]
struct Period {
    name: String,
    start: NaiveTime,
    end: NaiveTime,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(from = "parse::PeriodsSchedule")]
struct Schedule {
    name: String,
    periods: Vec<Period>,
}

#[derive(Debug, Clone)]
pub struct Class {
    name: String,
    start: NaiveDateTime,
    end: NaiveDateTime,
}

#[derive(Debug)]
pub struct Day {
    name: String,
    classes: Vec<Class>,
    special_day: Option<SpecialDay>,
}

#[derive(Debug, Clone)]
pub struct SpecialDay {
    name: Option<String>,
    schedule: ScheduleId,
}

pub type ScheduleId = String;

#[derive(Debug)]
pub enum ScheduleResolutionError {
    UnknownId(ScheduleId),
    NotFound(NaiveDate),
}

#[derive(Debug)]
pub struct Whatsnext {
    schedules: HashMap<ScheduleId, Schedule>,
    weekdays: HashMap<Weekday, ScheduleId>,
    special_days: HashMap<NaiveDate, SpecialDay>,
}

pub struct Timeline<'a> {
    date: NaiveDate,
    day: Day,
    classes_remaining: VecDeque<Class>,
    whatsnext: &'a Whatsnext,
}

impl Period {
    pub fn on_date(self: &Self, date: &NaiveDate) -> Class {
        Class {
            name: self.name.clone(),
            start: date.and_time(self.start),
            end: date.and_time(self.end),
        }
    }
}

impl Schedule {
    pub fn on_date(self: &Self, date: &NaiveDate) -> Day {
        let mut classes = Vec::<Class>::new();
        for period in self.periods.iter() {
            classes.push(period.on_date(date));
        }

        Day {
            name: self.name.clone(),
            classes,
            special_day: None,
        }
    }
}

impl Day {
    fn empty() -> Self {
        Day {
            name: "".to_string(),
            classes: Vec::<Class>::new(),
            special_day: None,
        }
    }
}

impl Whatsnext {
    pub fn new() -> Self {
        todo!();
    }

    fn schedule<'a>(
        self: &'a Self,
        date: &NaiveDate,
    ) -> Result<&'a Schedule, ScheduleResolutionError> {
        let schedule_id = self
            .special_days
            .get(date)
            .map(|special_day| &special_day.schedule)
            .or_else(|| self.weekdays.get(&date.weekday()))
            .ok_or(ScheduleResolutionError::NotFound(date.clone()))?;

        self.schedules
            .get(schedule_id)
            .ok_or(ScheduleResolutionError::UnknownId(schedule_id.to_string()))
    }

    pub fn day(self: &Self, date: &NaiveDate) -> Day {
        let schedule = self.schedule(&date);

        let mut day = schedule
            .ok()
            .map_or_else(Day::empty, |schedule| schedule.on_date(date));

        day.special_day = self.special_days.get(date).cloned();

        day
    }

    pub fn timeline(&self, date: NaiveDateTime) -> Timeline {
        let day = self.day(&date.date());
        let classes_remaining = day
            .classes
            .clone()
            .into_iter()
            .filter(|class| &date <= &class.end)
            .collect();
        Timeline {
            date: date.date(),
            day,
            classes_remaining,
            whatsnext: &self,
        }
    }
}

impl<'a> Timeline<'a> {
    pub fn date(&self) -> &NaiveDate {
        &self.date
    }

    pub fn day(&self) -> &Day {
        &self.day
    }
}

impl Day {
    pub fn name(&self) -> &str {
        &self.name
    }

    pub fn classes(&self) -> &Vec<Class> {
        &self.classes
    }

    pub fn special_day(&self) -> &Option<SpecialDay> {
        &self.special_day
    }
}

impl<'a> Iterator for Timeline<'a> {
    type Item = Class;

    fn next(self: &mut Self) -> Option<Self::Item> {
        loop {
            if let Some(class) = self.classes_remaining.pop_front() {
                return Some(class);
            };

            self.date += Duration::days(1);
            self.day = self.whatsnext.day(&self.date);

            self.classes_remaining = self.day.classes.clone().into();
        }
    }
}

#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        let result = 2 + 2;
        assert_eq!(result, 4);
    }
}
