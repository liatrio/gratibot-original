#
# terraform to set up DocumentDB
# 

resource "aws_docdb_cluster" "gratibot" {
  cluster_identifier = "gratibot-docdb-cluster"
  engine             = "docdb"
}
