class ClimateTracker < ActiveRecord::Base
	has_many :air_quality_trackers
	has_many :air_temperatures
	has_many :storm_trackers
	has_many :sea_trackers
	has_many :co2trackers
	has_many :animal_trackers
	has_many :glacier_trackers
end
