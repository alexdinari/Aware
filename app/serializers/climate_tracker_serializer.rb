class ClimateTrackerSerializer < ActiveModel::Serializer
  attributes :id, :topic, :description, :measurement_info
end
