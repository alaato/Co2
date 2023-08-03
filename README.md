# Co2
Our sensors are measuring a lot of air quality parameters, including CO2. New measurements are typically taken every 30 seconds, but let's imagine every 10 seconds for this challenge.

We want to visualise the history of those CO2 measurements to a user of our solution. The user should be able to see how the CO2 level changes over time and whether or not the CO2 concentration is in a "good" (i.e. healthy/productive) range, or whether it is too high.

Your task: Implement a simple web-based CO2 visualization where a random CO2 measurement value (between 400 and 3500 ppm) is getting pushed every 10 seconds from the app backend to the frontend. Use the following CO2 thresholds for the visualisation:

Good air quality: <= 1000 ppm
Average air quality: > 1000 ppm && <= 2000 ppm
Bad air quality: > 2000 ppm
