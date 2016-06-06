describe("Category", function() {
    var Category = require('../../category');

    beforeEach(function() {
        category = new Category();

        category.has_edges = {
            "food":{
	        "Mickies":["Butterscotch milkshake", "Sweet potato fries"],
	        "Ians":["Pizza"],
	        "Fresh Madison Market":["Butterscotch peanut butter"]},
            "location":{
	        "Mickies":["Madison"],
	        "Ians":["Madison"],
	        "Conversation zero":["Mickies"]},
            "essence":{
	        "Ians":["restaurant"],
	        "Mickies":["restaurant"],
	        "Fresh Madison Market":["store"],
	        "David Brown":["person"]},
            "author":{
	        "paper1":["David Brown"]},
            "topic":{
	        "paper1":["There are exactly 27 lines in every cubic surface"]}
        };
        category.is_edges = category.dualize_edges(category.has_edges);

        // List of all nodes in the graph.
        category.nodes = {"Mickies":{"data":"<node>Mickies Dairy Bar is a place</node>"},
		          "Ians":{"data":"<node/>"},
		          "Fresh Madison Market":{"data":"<node/>"},
		          "Conversation zero":{"data":"<node/>"},
		          "David Brown":{"data":"<node/>"},
		          "paper1":{"data":"<node/>"},
		          "Butterscotch milkshake":{"data":"<node/>"},
		          "Sweet potato fries":{"data":"<node/>"},
		          "Pizza":{"data":"<node/>"},
		          "Butterscotch peanut butter":{"data":"<node/>"},
		          "Madison":{"data":"<node/>"},
		          "restaurant":{"data":"<node/>"},
		          "store":{"data":"<node/>"},
		          "person":{"data":"<node/>"},
		          "There are exactly 27 lines in every cubic surface":{"data":"<node/>"}}

    });

    it("should be able to remove nodes", function() {

        category.node_del("Mickies");

        var expectedHasEdges = {
            "food":{
	        "Ians":["Pizza"],
	        "Fresh Madison Market":["Butterscotch peanut butter"]},
            "location":{
	        "Ians":["Madison"]},
            "essence":{
	        "Ians":["restaurant"],
	        "Fresh Madison Market":["store"],
	        "David Brown":["person"]},
            "author":{
	        "paper1":["David Brown"]},
            "topic":{
	        "paper1":["There are exactly 27 lines in every cubic surface"]}
        };

        var expectedIsEdges = {
            "food": {
                "Pizza": [ "Ians" ],
                "Butterscotch peanut butter": [ "Fresh Madison Market" ]},
            "location": {
                "Madison": [ "Ians" ]},
            "essence": {
                "restaurant": [ "Ians" ],
                "store": [ "Fresh Madison Market" ],
                "person": [ "David Brown" ]},
            "author": {
                "David Brown": [ "paper1" ]},
            "topic": {
                "There are exactly 27 lines in every cubic surface": [ "paper1" ]}
        }

        expect(JSON.stringify(category.has_edges)).toEqual(JSON.stringify(expectedHasEdges));
        expect(JSON.stringify(category.is_edges)).toEqual(JSON.stringify(expectedIsEdges));

        // Now remove enough to kill all edges:
        category.node_del("Ians");
	category.node_del("Fresh Madison Market");
        category.node_del("David Brown");
        category.node_del("paper1");

        expect(JSON.stringify(category.has_edges)).toEqual(JSON.stringify({}));
        expect(JSON.stringify(category.is_edges)).toEqual(JSON.stringify({}));
    });
});
