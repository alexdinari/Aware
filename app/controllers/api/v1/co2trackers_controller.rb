class Api::V1::Co2trackersController < ApplicationController
  protect_from_forgery with: :null_session

  respond_to :json, :xml, :json

  def index
    respond_with Co2tracker.all
  end

  def show
    respond_with Co2tracker.find(params[:id])
  end
end