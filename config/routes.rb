Rails.application.routes.draw do
  root to: 'application#index'
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      # /api/v1/co2trackers to retrieve all co2 levels globally
      resources :co2trackers
      #/api/v1/airqualitytrackers
      resources :airqualitytrackers
      #/api/v1/glaciertrackers
      resources :glaciertrackers
      #/api/v1/sealeveltrackers
      resources :sealeveltrackers      
    end
  end
end
