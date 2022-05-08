use directories::ProjectDirs;
use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use std::path::Path;
use serde_yaml;
use std::fmt;
use std::time::{Duration};
use std::error::{Error};
use crate::School;
use crate::parse::{periods_io};

pub type SchoolId = String;

#[derive(Debug, Clone)]
struct ErrorNoProjectDirs;

impl fmt::Display for ErrorNoProjectDirs {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "could not find project directories")
    }
}

impl Error for ErrorNoProjectDirs {
    fn source(&self) -> Option<&(dyn Error + 'static)> { None }
    fn description(&self) -> &str { "could not find project directories" }
    fn cause(&self) -> Option<&dyn Error> { None }

}

pub async fn get_school(id: &SchoolId, cache_stale_after: &Duration) -> Result<School, Box<dyn std::error::Error>> {
    let proj_dirs = ProjectDirs::from("com", "Bla B Bla Bla Enteprises",  "whatsnext");
    
    let path = proj_dirs.map(|dirs|
        dirs.cache_dir()
        .join(id)
        .with_extension("yaml"))
        .ok_or(ErrorNoProjectDirs)?;
    
        let cached = read_cached_school(&path);

    if is_stale(&path, cache_stale_after).await {
        let fetch = fetch_school(id);

        match fetch.await {
            Ok(fetched) => {
                write_to_cache(&path, &fetched).await?
            },
            Err(_err) => {}
        }
    }
    
    Ok(cached.await?)
}

async fn read_cached_school(path: &Path) -> Result<School, Box<dyn std::error::Error>> {
        let mut file = File::open(path).await?;
        let mut contents = vec![];
        file.read_to_end(&mut contents).await?;

        let school = serde_yaml::from_slice::<School>(&contents)?;
        Ok(school)
}

async fn write_to_cache(path: &Path, school: &School, ) -> Result<(), Box<dyn std::error::Error>> {
    tokio::fs::create_dir_all(path.parent().unwrap()).await?;
    let mut file = File::create(path).await?;
    let contents = serde_yaml::to_vec(school)?;
    file.write_all(&contents).await?;
    Ok(())
}

async fn fetch_school(id: &SchoolId) -> Result<School, reqwest::Error> {
    let school = async {
        reqwest::get(format!("https://api.periods.io/school/{}", id))
            .await?
            .json::<periods_io::PeriodsSchool>()
            .await
    };
    let calendar = async {
        reqwest::get(format!("https://api.periods.io/schedule/{}", id))
            .await?
            .json::<periods_io::PeriodsCalendar>()
            .await
    };

    let (school, calendar) = tokio::try_join!(school, calendar)?;
    let school = periods_io::to_school(school, calendar);

    Ok(school)
}

async fn is_stale(path: &Path, max_age: &Duration) -> bool {
    tokio::fs::metadata(path).await.ok()
    .and_then(|metadata| metadata.modified().ok())
    .and_then(|modified_time| modified_time.elapsed().ok())
    .map(|elapsed_time| elapsed_time > *max_age)
    .unwrap_or(true)
}
// load from disk
// fetch

// async save to disk

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_get_school() {
        let rt  = tokio::runtime::Runtime::new().unwrap();
        rt.block_on(async {
            let school = get_school(&"mvhs".to_string(), &Duration::from_secs(5)).await;
            assert!(school.is_ok());
        })
    }
}