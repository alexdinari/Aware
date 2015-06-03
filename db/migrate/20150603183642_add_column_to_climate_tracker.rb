class AddColumnToClimateTracker < ActiveRecord::Migration
  def change
    add_column :climate_trackers, :measurement_info, :string
  end
end
