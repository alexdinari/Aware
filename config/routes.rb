Rails.application.routes.draw do
  root 'application#index'
  namespace :api, defaults: {format: :json} do
    namespace :v1 do
      # /api/v1/co2trackers to retrieve all co2 levels globally
      resources :co2trackers
    end
  end
end
