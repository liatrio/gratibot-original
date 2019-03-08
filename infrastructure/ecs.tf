#
# ECS configuration for gratibot
#

resource "aws_ecs_cluster" "main" {
  name = "gratibot-cluster"
}

data "aws_caller_identity" "current" {}

data "aws_iam_role" "ecs_task_execution" {
  name = "ecsTaskExecutionRole"
}

resource "aws_ecs_task_definition" "gratibot" {
  family                   = "gratibot"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "${var.fargate_cpu}"
  memory                   = "${var.fargate_memory}"
  execution_role_arn       = "${data.aws_iam_role.ecs_task_execution.arn}"

  container_definitions = <<DEFINITION
  [
    {
      "cpu": ${var.fargate_cpu},
      "executionRoleArn": "${data.aws_iam_role.ecs_task_execution.arn}",
      "image": "${var.app_image}",
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "Gratibot",
          "awslogs-region": "${var.aws_region}",
          "awslogs-stream-prefix": "gratibot"
        }
      },
      "memory": ${var.fargate_memory},
      "name": "gratibot",
      "networkMode": "awsvpc",
      "portMappings": [
        {
          "containerPort": ${var.app_port},
          "hostPort": ${var.app_port}
        }
      ],
      "secrets": [
        {
          "name": "clientId",
          "valueFrom": "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/gratibot-slack-clientid"
        },
        {
          "name": "clientSecret",
          "valueFrom": "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/gratibot-slack-client-secret"
        },
        {
          "name": "clientSigningSecret",
          "valueFrom": "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/gratibot-slack-signing-secret"
        },
        {
          "name": "mongodbUri",
          "valueFrom": "arn:aws:ssm:${var.aws_region}:${data.aws_caller_identity.current.account_id}:parameter/gratibot-mongodb-string"
        }
      ]
    }
  ]
  DEFINITION
}

resource "aws_ecs_service" "main" {
  name            = "gratibot-service"
  cluster         = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.gratibot.arn}"
  desired_count   = "${var.app_count}"
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = ["${aws_security_group.ecs_tasks.id}"]
    subnets         = ["${aws_subnet.private.*.id}"]
  }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.app.id}"
    container_name   = "gratibot"
    container_port   = "${var.app_port}"
  }

  depends_on = [
    "aws_alb_listener.front_end",
  ]
}
