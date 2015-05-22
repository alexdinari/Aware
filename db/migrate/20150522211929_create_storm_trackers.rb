class CreateStormTrackers < ActiveRecord::Migration
  def change
    create_table :storm_trackers do |t|
      t.integer :year
      t.float :num_storms
      t.float :storm_strength
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
