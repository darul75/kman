'use strict';
angular.module('kman')
.controller('homeCtrl', ['authorized', '$scope', 'Post', 'Comment', 'Socket', function(authorized, $scope, Post, Comment, Socket){
    var user = $scope.common.user;

    $scope.postBox = {
        content: '',
        disabled: false
    };

    $scope.posts = [];

    function addPost(newPost){
        var _id = newPost._id;
        if(!$scope.posts.some(function(post){
            return post._id === _id;
        })){
            $scope.posts.unshift(newPost);
        }
    }

    function addComment(newComment){
        var postId = newComment.belongTo;
        var posts, post;
        if((posts = $scope.posts.filter(function(post){
            return post._id === postId;
        })).length){
            post = posts[0];
            if(!post.comments.some(function(comment){
                return comment._id === newComment._id;
            })){
                post.comments.push(newComment);
            }
        }
    }

    Socket.on('post', addPost);

    Socket.on('comment', addComment);

    Post.query().$promise.then(function(posts){
        posts.forEach(function(post){
            post.commentBox = {
                content: '',
                disabled: false
            };
            post.comments = post.comments || [];
        });
        $scope.posts = posts;
    });

    $scope.createPost = function(){
        if(!$scope.postBox.content.length || $scope.postBox.disabled){
            return;
        }
        $scope.postBox.disabled = true;
        var post = new Post({
            content: $scope.postBox.content,
            createdBy: user._id
        });

        post.$save(function(post){
            $scope.postBox.content = '';
            $scope.postBox.disabled = false;
            post.commentBox = {
                content: '',
                disabled: false
            };
            addPost(post);
        });
    };

    $scope.createComment = function($event, post){
        if($event.keyCode !== 13){
            return;
        }

        if(!post.commentBox.content.length || post.commentBox.disabled){
            $event.preventDefault();
            return;
        }

        post.commentBox.disabled = true;

        var comment = new Comment({
            content: post.commentBox.content,
            createdBy: user._id,
            belongTo: post._id
        });

        comment.$save(function(comment){
            post.commentBox.content = '';
            post.commentBox.disabled = false;
            addComment(comment);
        });
    };


}]);