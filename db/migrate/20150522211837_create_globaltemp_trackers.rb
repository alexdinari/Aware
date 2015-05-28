class CreateGlobaltempTrackers < ActiveRecord::Migration
  def change
    create_table :globaltemp_trackers do |t|
      t.integer :year
      t.float :temp
      t.references :climate_tracker, index: true, foreign_key: true

      t.timestamps null: false
    end
  end
end
