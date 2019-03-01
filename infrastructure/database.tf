#
# DocumentDB Setup
#

data "aws_kms_key" "gratibot" {
  key_id = "alias/gratibot"
}

resource "aws_docdb_cluster" "gratibot" {
  cluster_identifier = "gratibot-cluster"
  master_username    = "${var.master_username}"
  master_password    = "${var.master_password}"
  availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]
  storage_encrypted  = true
  kms_key_id         = "${data.aws_kms_key.gratibot.arn}"
}

resource "aws_docdb_cluster_instance" "gratibot_cluster_instances" {
  count              = 1
  cluster_identifier = "${aws_docdb_cluster.gratibot.id}"
  identifier         = "docdb-cluster-gratibot-${count.index}"
  instance_class     = "db.r4.large"
}
