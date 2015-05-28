class AnimalTrackerSerializer < ActiveModel::Serializer
  attributes :id, :name, :date, :url, :count
end
