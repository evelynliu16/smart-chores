require 'test_helper'

class SigninRegisterControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get signin_register_index_url
    assert_response :success
  end

end
