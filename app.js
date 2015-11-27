angular.module('bassify', []);

angular.module('bassify').
	// Create mopidy as a service.
//	factory('mopidy', function($q) {
//		var defer = $q.defer();
//
//		// Connect to server.
//		var mopidy = new Mopidy();
//		// Bind log to console.
//		mopidy.on(console.log.bind(console));
//
//		mopidy.on("state::online", defer.resolve);
//
//		return defer.promise;
//	}).
	controller('TracklistController', function($scope) {
        var self = this;
		self.tracklist = [];

        function get(key, object) {
            return object[key];
        }

        var mopidy = new Mopidy({"callingConvention": "by-position-only"});
        mopidy.on("state:online", function() {
            console.log("we're online");
            self.ready = true;

            mopidy.playlists.getPlaylists()
                .fold(get, 0)
                .fold(get, 'tracks')
                .then(mopidy.tracklist.add)
                .then(getTracklistNames);
        });

        function extractTrackFromTlTrack(tlTrack, index, tracks) {
            return {
                trackName: tlTrack.track.name,
                artists: tlTrack.track.artists,
                album: tlTrack.track.album.name,
                length: tlTrack.track.length,
                uri: tlTrack.track.uri
            };
        }

		function getTracklistNames(tracks) {
            $scope.$apply(function() {
                self.tracks = tracks.map(extractTrackFromTlTrack);
            });
            console.log(self.tracks);
		}
	});
