class CreateClimateTrackers < ActiveRecord::Migration
  def change
    create_table :climate_trackers do |t|
    	t.string :topic
    	t.string :description
    	t.string :measurement_info

      t.timestamps null: false
    end
  end
end
