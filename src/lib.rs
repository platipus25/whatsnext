use chrono::{Datelike, Duration, NaiveDate, NaiveDateTime, NaiveTime, Weekday};
use serde::{Deserialize, Serialize};
use std::collections::{HashMap, VecDeque};

pub mod parse;
pub mod sources;

#[derive(Debug, Serialize, Deserialize)]
pub struct School {
    pub periods: Vec<String>,
    schedules: HashMap<ScheduleId, Schedule>,
    weekdays: HashMap<Weekday, ScheduleId>,
    special_days: HashMap<NaiveDate, SpecialDay>,
}

#[derive(Debug, Serialize, Deserialize)]
struct Period {
    name: String,
    start: NaiveTime,
    end: NaiveTime,
}

#[derive(Debug, Serialize, Deserialize)]
struct Schedule {
    name: String,
    periods: Vec<Period>,
}

#[derive(Debug, Clone)]
pub struct Class<'a> {
    pub name: &'a str,
    pub start: NaiveDateTime,
    pub end: NaiveDateTime,
}

#[derive(Debug)]
pub struct Day<'a> {
    pub name: &'a str,
    pub classes: Vec<Class<'a>>,
    pub special_day: Option<&'a SpecialDay>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SpecialDay {
    pub name: Option<String>,
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
    pub school: School,
}

pub struct Timeline<'a> {
    pub date: NaiveDate,
    pub day: Day<'a>,
    classes_remaining: VecDeque<Class<'a>>,
    whatsnext: &'a Whatsnext,
}

impl Period {
    pub fn on_date(self: &Self, date: &NaiveDate) -> Class {
        Class {
            name: &self.name,
            start: date.and_time(self.start),
            end: date.and_time(self.end),
        }
    }
}

impl<'a> Schedule {
    pub fn on_date(self: &'a Self, date: &NaiveDate) -> Day<'a> {
        let mut classes = Vec::<Class>::new();
        for period in self.periods.iter() {
            classes.push(period.on_date(date));
        }

        Day {
            name: &self.name,
            classes,
            special_day: None,
        }
    }
}

impl<'a> Day<'a> {
    fn empty() -> Self {
        Day {
            name: "",
            classes: Vec::new(),
            special_day: None,
        }
    }
}

impl Whatsnext {
    pub fn new(school: School) -> Self {
        Whatsnext { school }
    }

    fn schedule<'a>(
        self: &'a Self,
        date: &NaiveDate,
    ) -> Result<&'a Schedule, ScheduleResolutionError> {
        let schedule_id = self
            .school
            .special_days
            .get(date)
            .map(|special_day| &special_day.schedule)
            .or_else(|| self.school.weekdays.get(&date.weekday()))
            .ok_or(ScheduleResolutionError::NotFound(date.clone()))?;

        self.school
            .schedules
            .get(schedule_id)
            .ok_or(ScheduleResolutionError::UnknownId(schedule_id.to_string()))
    }

    pub fn day(&self, date: &NaiveDate) -> Day {
        let schedule = self.schedule(&date);

        let mut day = schedule
            .ok()
            .map(|schedule| schedule.on_date(date))
            .unwrap_or_else(Day::empty);

        day.special_day = self.school.special_days.get(date);

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

impl<'a> Iterator for Timeline<'a> {
    type Item = Class<'a>;

    fn next(self: &mut Self) -> Option<Self::Item> {
        loop {
            if let Some(class) = self.classes_remaining.pop_front() {
                return Some(class);
            };

            self.date += Duration::days(1);
            self.day = self.whatsnext.day(&self.date);

            self.classes_remaining = self.day.classes.clone().into_iter().collect();
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
