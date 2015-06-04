# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20150603183642) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "air_quality_trackers", force: :cascade do |t|
    t.integer  "date"
    t.string   "city_name"
    t.float    "pm10"
    t.float    "pm25"
    t.integer  "climate_tracker_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "air_quality_trackers", ["climate_tracker_id"], name: "index_air_quality_trackers_on_climate_tracker_id", using: :btree

  create_table "air_temperatures", force: :cascade do |t|
    t.integer  "year"
    t.float    "temp"
    t.integer  "climate_tracker_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "air_temperatures", ["climate_tracker_id"], name: "index_air_temperatures_on_climate_tracker_id", using: :btree

  create_table "animal_trackers", force: :cascade do |t|
    t.string   "name"
    t.date     "date"
    t.string   "url"
    t.integer  "count"
    t.integer  "climate_tracker_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "animal_trackers", ["climate_tracker_id"], name: "index_animal_trackers_on_climate_tracker_id", using: :btree

  create_table "climate_trackers", force: :cascade do |t|
    t.string   "topic"
    t.string   "description"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
    t.string   "measurement_info"
  end

  create_table "co2trackers", force: :cascade do |t|
    t.integer  "year"
    t.float    "ppm"
    t.integer  "climate_tracker_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "co2trackers", ["climate_tracker_id"], name: "index_co2trackers_on_climate_tracker_id", using: :btree

  create_table "glacier_trackers", force: :cascade do |t|
    t.integer  "year"
    t.float    "melt_rate"
    t.integer  "climate_tracker_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "glacier_trackers", ["climate_tracker_id"], name: "index_glacier_trackers_on_climate_tracker_id", using: :btree

  create_table "sea_trackers", force: :cascade do |t|
    t.integer  "year"
    t.float    "temp"
    t.float    "rise_rate"
    t.integer  "climate_tracker_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "sea_trackers", ["climate_tracker_id"], name: "index_sea_trackers_on_climate_tracker_id", using: :btree

  create_table "seatemp_trackers", force: :cascade do |t|
    t.integer  "year"
    t.integer  "month"
    t.float    "heat_content"
    t.integer  "climate_tracker_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "seatemp_trackers", ["climate_tracker_id"], name: "index_seatemp_trackers_on_climate_tracker_id", using: :btree

  create_table "storm_trackers", force: :cascade do |t|
    t.integer  "year"
    t.float    "num_storms"
    t.float    "storm_strength"
    t.integer  "climate_tracker_id"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  add_index "storm_trackers", ["climate_tracker_id"], name: "index_storm_trackers_on_climate_tracker_id", using: :btree

  add_foreign_key "air_quality_trackers", "climate_trackers"
  add_foreign_key "air_temperatures", "climate_trackers"
  add_foreign_key "animal_trackers", "climate_trackers"
  add_foreign_key "co2trackers", "climate_trackers"
  add_foreign_key "glacier_trackers", "climate_trackers"
  add_foreign_key "sea_trackers", "climate_trackers"
  add_foreign_key "seatemp_trackers", "climate_trackers"
  add_foreign_key "storm_trackers", "climate_trackers"
end
