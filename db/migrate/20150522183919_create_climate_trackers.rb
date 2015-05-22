class CreateClimateTrackers < ActiveRecord::Migration
  def change
    create_table :climate_trackers do |t|

      t.timestamps null: false
    end
  end
end
