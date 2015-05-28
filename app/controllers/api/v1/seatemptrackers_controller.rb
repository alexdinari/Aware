class Api::V1::SeatemptrackersController < ApplicationController
  protect_from_forgery with: :null_session

  respond_to :json, :xml, :json

  def index
    respond_with SeatempTracker.all
  end

  def show
    respond_with SeatempTracker.find(params[:id])
  end
end