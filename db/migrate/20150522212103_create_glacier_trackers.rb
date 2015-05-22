class CreateGlacierTrackers < ActiveRecord::Migration
  def change
    create_table :glacier_trackers do |t|
      t.integer :year
      t.float :melt_rate
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
