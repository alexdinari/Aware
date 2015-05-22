class CreateCo2trackers < ActiveRecord::Migration
  def change
    create_table :co2trackers do |t|
      t.integer :year
      t.float :ppm
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
