class CreateAirQualityTrackers < ActiveRecord::Migration
  def change
    create_table :air_quality_trackers do |t|
      t.integer :date
      t.string :city_name
      t.float :pm10
      t.float :deaths
      t.string :region
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
