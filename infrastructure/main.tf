terraform {
  backend "s3" {
    bucket = "chatbot-tfstates"
    key    = "state/gratibot.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "us-east-1"
}
