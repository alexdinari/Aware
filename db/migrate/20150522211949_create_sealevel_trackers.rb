class CreateSealevelTrackers < ActiveRecord::Migration
  def change
    create_table :sealevel_trackers do |t|
      t.integer :year
      t.float :sea_level
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
