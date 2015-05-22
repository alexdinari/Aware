class CreateSeaTrackers < ActiveRecord::Migration
  def change
    create_table :sea_trackers do |t|
      t.integer :year
      t.float :temp
      t.float :rise_rate
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
