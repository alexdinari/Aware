class Api::V1::GlobaltemptrackersController < ApplicationController
  protect_from_forgery with: :null_session

  respond_to :json, :xml, :json

  def index
    respond_with GlobaltempTracker.all
  end

  def show
    respond_with GlobaltempTracker.find(params[:id])
  end
end