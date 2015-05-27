class Api::V1::AirQualitytrackersController < ApplicationController
  protect_from_forgery with: :null_session

  respond_to :json, :xml, :json

  def index
    respond_with AirQualityTracker.all
  end

  def show
    respond_with AirQualityTracker.find(params[:id])
  end
end