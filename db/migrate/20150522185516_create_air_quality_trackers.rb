class CreateAirQualityTrackers < ActiveRecord::Migration
  def change
    create_table :air_quality_trackers do |t|
      t.date :date
      t.string :city_name
      t.float :pm10
      t.float :pm25
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
