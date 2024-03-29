# Gibberish uses a unique salt for every encryption, but we need the same text to return the same ciphertext
# so Searching for encrypted field will work

require 'gibberish/aes'

# Gibberish uses a unique salt for every encryption, but we need the same text to return the same ciphertext
# so Searching for encrypted field will work
class GibberishCipher
  def initialize(password, salt)
    if defined?(Gibberish::AES::CBC)
      @cipher = Gibberish::AES::CBC.new(password)
    else
      @cipher = Gibberish::AES.new(password)
    end
    @salt = salt
  end

  def encrypt(data)
    @cipher.encrypt(data, salt: @salt)
  end

  def decrypt(data)
    @cipher.decrypt(data)
  end
end

# Mongoid::EncryptedFields.cipher = GibberishCipher.new(ENV['MY_PASSWORD'], ENV['MY_SALT'])
Mongoid::EncryptedFields.cipher = GibberishCipher.new(Rails.application.secrets.cipher_password, Rails.application.secrets.cipher_salt)
