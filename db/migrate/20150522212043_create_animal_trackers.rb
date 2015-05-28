class CreateAnimalTrackers < ActiveRecord::Migration
  def change
    create_table :animal_trackers do |t|
      t.string :name
      t.integer :date
      t.string :url
      t.integer :count
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
