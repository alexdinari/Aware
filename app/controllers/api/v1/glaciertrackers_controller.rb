class Api::V1::GlaciertrackersController < ApplicationController
  protect_from_forgery with: :null_session

  respond_to :json, :xml, :json

  def index
    respond_with GlacierTracker.all
  end

  def show
    respond_with GlacierTracker.find(params[:id])
  end
end