<?php
require_once 'gPoint.php';

$easting = $_GET['easting'];
$northing = $_GET['northing'];
$zone = '55';

$point = & new gPoint();    // Create an empty point 
$point->setUTM($easting, $northing, $zone);    // Easting/Northing from a GPS 
$point->convertTMtoLL();

$obj = array('lat' => $point->lat, 'lon' => $point->long);
// echo $point->printLatLong();
die(json_encode($obj));