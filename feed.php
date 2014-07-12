<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$url = 'https://s3-ap-southeast-2.amazonaws.com/govhack-zombies/vic_pubs.json';
$c = file_get_contents($url);
$q = json_decode($c);
$i = $q->items;
$q->items = array_slice($i, 0, 300);
$c = json_encode($q);
die($c);

// $_a = -37.8165504;
// $_b = 144.96169445;

// $category = array_key_exists('category', $_GET) ? $_GET['category'] : 'Example';

// $modifier = 20;
// if(rand(0,1) == 1) $modifier *= -1;


// $items = array();

// for($i=0;$i<30;$i++) {
// 	$latitude = $_a + (rand(0, 1) / 1000000);
// 	$longitude = $_b + (rand(0, 1) / 1000000);
// 	$title = 'Example';
// 	$items[] = compact('title', 'latitude', 'longitude');
// }

// $json = compact('category', 'modifier', 'items');

// die(json_encode($json));