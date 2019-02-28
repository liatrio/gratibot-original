terraform {
  backend "s3" {
    bucket = "slackbots-tfstates"
    key    = "state/gratibot-admin.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = "${var.aws_region}"
}

resource "aws_kms_key" "gratibot" {
  description             = "gratibot resource key"
  deletion_window_in_days = 21
}

resource "aws_kms_alias" "gratibot" {
  name          = "alias/gratibot"
  target_key_id = "${aws_kms_key.gratibot.id}"
}

resource "aws_ssm_parameter" "slack_client_id" {
  name        = "gratibot-slack-clientid"
  description = "slack client id for gratibot app"
  key_id      = "${aws_kms_key.gratibot.key_id}"
  value       = "${var.slack_client_id}"
  type        = "SecureString"
}

resource "aws_ssm_parameter" "slack_client_secret" {
  name        = "gratibot-client-secret"
  description = "slack client secret for gratibot app"
  key_id      = "${aws_kms_key.gratibot.key_id}"
  value       = "${var.slack_client_secret}"
  type        = "SecureString"
}

resource "aws_ssm_parameter" "slack_client_signing_secret" {
  name        = "gratibot-signing-secret"
  description = "slack client signing secret for gratibot app"
  key_id      = "${aws_kms_key.gratibot.key_id}"
  value       = "${var.slack_client_signing_secret}"
  type        = "SecureString"
}

resource "aws_iam_role" "ecs_task_exectution" {
  name = "ecsTaskExecutionRole"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "ssm:GetParameters",
        "kms:Decrypt"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}
