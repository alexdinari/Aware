class CreateSeatempTrackers < ActiveRecord::Migration
  def change
    create_table :seatemp_trackers do |t|
      t.integer :year
      t.integer :month
      t.float :heat_content
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
