class Api::V1::SealeveltrackersController < ApplicationController
  protect_from_forgery with: :null_session

  respond_to :json, :xml, :json

  def index
    respond_with SealevelTracker.all
  end

  def show
    respond_with SealevelTracker.find(params[:id])
  end
end