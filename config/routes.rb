Rails.application.routes.draw do
  devise_for :users
  resources :profiles do
    resources :depends
    resources :supports
    resources :controls
    resources :profile_attributes
    resources :groups
  end
  resources :mappings
  resources :evaluations do
    resources :results
  end

  match 'profile_upload' => 'profiles#upload', :as => :upload_profile, :via => :post
  match 'evaluation_upload' => 'evaluations#upload', :as => :upload_evaluation, :via => :post
  match 'mapping_upload' => 'mappings#upload', :as => :upload_mapping, :via => :post
  match 'mapping_new_entry' => 'mappings#entry', :as => :new_entry_mapping, :via => :post

  # Root path (/)
  root :to => 'dashboard#index'
end
