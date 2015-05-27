class AirQualityTrackerSerializer < ActiveModel::Serializer
  attributes :id, :date, :city_name, :pm25, :region, :deaths 
end
