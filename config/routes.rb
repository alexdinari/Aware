Rails.application.routes.draw do
  root to: 'application#index'
  namespace :api, defaults: {format: :json} do
    namespace :v1 do

      # /api/v1/topics
      resources :climatetrackers, :path => 'topics'      

      # /api/v1/co2emissions
      resources :co2trackers, :path => 'co2emissions'

      #/api/v1/airquality
      resources :airqualitytrackers, :path => 'airquality'

      #/api/v1/glacier
      resources :glaciertrackers, :path => 'glacier'

      #/api/v1/globaltemp
      resources :globaltemptrackers, :path => 'globaltemp'      

      #/api/v1/sealevel
      resources :sealeveltrackers, :path => 'sealevel'

      #/api/v1/seatemp
      resources :seatemptrackers, :path => 'seatemp'

      #/api/v1/endangered_species    
      resources :animaltrackers, :path => 'endangered_species'

    end
  end
end
