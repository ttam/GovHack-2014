<!DOCTYPE html>
<html lang="en" ng-app="GovHack">
	<head>
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=640, initial-scale=1">
		<meta name="description" content="">
		<meta name="author" content="">
		<title>GovHack</title>

		<link href="/css/bootstrap.min.css" rel="stylesheet">
		<style>
		@font-face {
			font-family: 'shaun_of_the_deadregular';
			src: url('/fonts/shaun_of_the_dead-webfont.eot');
			src: url('/fonts/shaun_of_the_dead-webfont.eot?#iefix') format('embedded-opentype'),
				url('/fonts/shaun_of_the_dead-webfont.woff') format('woff'),
				url('/fonts/shaun_of_the_dead-webfont.ttf') format('truetype'),
				url('/fonts/shaun_of_the_dead-webfont.svg#shaun_of_the_deadregular') format('svg');
			font-weight: normal;
			font-style: normal;
		}

		html, body { height: 100%; width: 100%; }
		body {
			background-image: url(http://maps.googleapis.com/maps/api/staticmap?center=Albany,+NY&zoom=13&scale=1&size=600x600&maptype=roadmap&sensor=false&format=png&visual_refresh=true);
			background-size: cover;
			overflow: hidden;
		}

		#splash, #splash .container, #splash .row {
			height: 100%;
			width: 100%;
		}

		#splash {
background: -moz-linear-gradient(top,  rgba(216,216,216,0.8) 0%, rgba(255,255,255,0.8) 68%, rgba(255,255,255,0.8) 100%); /* FF3.6+ */
background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,rgba(216,216,216,0.8)), color-stop(68%,rgba(255,255,255,0.8)), color-stop(100%,rgba(255,255,255,0.8))); /* Chrome,Safari4+ */
background: -webkit-linear-gradient(top,  rgba(216,216,216,0.8) 0%,rgba(255,255,255,0.8) 68%,rgba(255,255,255,0.8) 100%); /* Chrome10+,Safari5.1+ */
background: -o-linear-gradient(top,  rgba(216,216,216,0.8) 0%,rgba(255,255,255,0.8) 68%,rgba(255,255,255,0.8) 100%); /* Opera 11.10+ */
background: -ms-linear-gradient(top,  rgba(216,216,216,0.8) 0%,rgba(255,255,255,0.8) 68%,rgba(255,255,255,0.8) 100%); /* IE10+ */
background: linear-gradient(to bottom,  rgba(216,216,216,0.8) 0%,rgba(255,255,255,0.8) 68%,rgba(255,255,255,0.8) 100%); /* W3C */
filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#ccd8d8d8', endColorstr='#ccffffff',GradientType=0 ); /* IE6-9 */


			/*background-color: rgba(255, 0, 0, 0.8);*/
			color: #000000;
			/*background-color: rgba(255, 0, 0, 0.6);*/
		}

		#splash .container {
			/*background-image: url(/img/zombies.png);
			background-repeat: repeat-x;
			background-position: 0 bottom;*/
		}

		#splash .row > div {
			height: 100%;
			/*width: 100%;*/
		}

		#splash .bg {
			/*background-image: url(/img/biohazard.png);*/
			background-image: url(/img/hero.png);
			background-position: center 30%;
			background-repeat: no-repeat;
		}

		#splash .zombies {
			position: absolute;
			bottom: 0;
			left: 0;
			height: 400px;
			width: 100%;

			background-image: url(/img/zombies.png);
			background-repeat: repeat-x;
			background-position: 0 bottom;
		}

		#splash .intro {
			margin-top: 50px;
		}

		h1 {
			font-family: 'shaun_of_the_deadregular';
			font-size: 100px;
			text-align: center;
		}
		</style>
	</head>

	<body>

		<div id="splash">
			<div class="container">
				<div class="row">
					<div class="col-sm-6 hidden-sm visible-md-block visible-lg-block bg"></div>
					<div class="zombies"></div>
					<div class="col-md-6">
						<div class="intro col-sm-10 col-sm-offset-1">
							<h1>Zombie Survival</h1>

							<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dui elit, auctor id facilisis ut, bibendum et nunc. Nullam ac ligula faucibus, aliquet libero eu, porta eros. Pellentesque magna purus, luctus ut mattis id, placerat vitae libero. Donec fermentum sodales nulla ultricies blandit. Mauris tincidunt massa euismod vulputate fermentum. Sed a purus neque. Aenean vel condimentum erat.</p>

							<hr>

							<a href="#" class="btn btn-block btn-danger btn-lg">x Worship</a>
							<a href="#" class="btn btn-block btn-danger btn-lg">x Drink</a>
							<a href="#" class="btn btn-block btn-danger btn-lg" data-toggle="modal" data-target="#sitModal">x Sit</a>
						</div>
					</div>
				</div>
			</div>
		</div>


		<div class="modal fade" id="sitModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
			<div class="modal-dialog">
				<div class="modal-content">
					<div class="modal-header">
						<button type="button" class="close" data-dismiss="modal">
							<span aria-hidden="true">&times;</span>
							<span class="sr-only">Close</span>
						</button>
		
						<h4 class="modal-title" id="myModalLabel">Getting you to safety</h4>
    		  </div>

					<div class="modal-body">
						<!-- <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dui elit, auctor id facilisis ut, bibendum et nunc. Nullam ac ligula faucibus, aliquet libero eu, porta eros. Pellentesque magna purus, luctus ut mattis id, placerat vitae libero. Donec fermentum sodales nulla ultricies blandit. Mauris tincidunt massa euismod vulputate fermentum. Sed a purus neque. Aenean vel condimentum erat.</p> -->
						<div class="progress">
							<div class="progress-bar progress-bar-danger" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="width: 60%;">
								<span>Killing Phil</span>
							</div>
						</div>
					</div>

<!-- 					<div class="modal-footer">
						<button type="button" class="btn btn-danger">Wooden Bench</button>
						<button type="button" class="btn btn-danger">Metal Bench</button>
						<button type="button" class="btn btn-danger">Green Bench</button>
						<button type="button" class="btn btn-danger">Brown Bench</button>
					</div>
 -->		    </div>
			</div>
		</div>

		<script src="/js/jquery.min.js"></script>
		<script src="/js/bootstrap.min.js"></script>

		<script>
		$(function() {
			$('#sit').on('click', function(e) {
				$('#bench').modal('show');
			});
		});
		</script>
 	</body>
</html>