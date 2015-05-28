class Api::V1::ClimatetrackersController < ApplicationController
  protect_from_forgery with: :null_session

  respond_to :json, :xml, :json

  def index
    respond_with ClimateTracker.all
  end

  def show
    respond_with ClimateTracker.find(params[:id])
  end
end