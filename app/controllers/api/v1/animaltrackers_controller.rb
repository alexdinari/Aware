class Api::V1::AnimaltrackersController < ApplicationController
  protect_from_forgery with: :null_session

  respond_to :json, :xml, :json

  def index
    respond_with AnimalTracker.all
  end

  def show
    respond_with AnimalTracker.find(params[:id])
  end
end