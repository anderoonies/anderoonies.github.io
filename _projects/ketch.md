---
title: Ketch
layout: page
photo_url: /projects/ketch/ketch.png
excerpt: Learning from a failed app.
---

# Ketch

<div class="image-feature">
  <img src="http://i.imgur.com/ENQZUcV.gif">
  <div class="caption"> "User flow" </div>
</div>

Ketch was an app I made with some Northwestern graduate students as a part of Northwestern's [NUvention](http://www.farley.northwestern.edu/we-teach/nuvention/) program.

It was built across the 6 months, from an idea to prototypes to a complete iOS app. Through the NUvention program, Ketch was dissected weekly by a group of course advisers and presented twice to a board of investors.

It was a crazy experience that now lives primarily in Google Drive and in 3 git repositories. This page is an attempt to pull it all together and contextualize it. I'll try to talk about Ketch here without reciting the elevator pitch I had to rehearse and without using the buzzwords the product was built around.

## What?

Ketch's goal was to connect you to friends nearby. That was it. The idea was that Find My Friends was too invasive (a friend can see you 24/7), texting feels at times too aggressive, and group messages are unproductive. Ketch made events temporary, spontaneous, and special. If you saw an event on the map you knew that friend had specifically invited _you_ to be able to see it.

(I've rehearsed that so many times that I didn't even need to think when writing it.)

The premise of the app, of course, needs for a lot of people to be using the app and opening the app often. We had thought this could work.

## Making It (And Not Making it)

Ketch was a huge technical undertaking for me. The only other iOS app I had made was a Hello World. Ideally, NUvention teams have multiple developers but things aren't always ideal. I built Ketch from the bottom up continuously throughout the entire time we were working on it. There was never a weekend where I wasn't plugging away at a feature the group had decided would be the one that made users love the app.

First, making it.

### Prototyping

<div class="image-feature">
  <img src="/projects/ketch/proto1.png" align="center">
  <img src="/projects/ketch/proto2.png" align="center">
</div>

How could it be a failed app without paper prototying?

Prototypes taught us we needed some visual interface that could communicate all the information of events to users quickly. This meant either a calendar or a map, which meant I implemented a calendar interface and a map interface.

### Map

I first implemented the map using native Apple Maps. But, on the chance that a user would want to see a 3D building, I converted to Google Maps. The implementation ended up being loosely a view controller that implemented the `GMSMapViewDelegate` protocol. It was peppered with `FriendAnnotation`s pulled _very_ synchronously from a Parse back-end. Implementing Google Maps was pretty painless—the API is pretty similar to Apple Maps except for adding annotations.

I just plunked down the GMS `mapView_` on top of the view controller, then adding annotations was straightforward.

{% highlight objective-c %}
for (FriendAnnotation *annotation in _mapMarkers) {
    CustomGMSMarker *marker = [CustomGMSMarker markerWithPosition:annotation.coordinate];
    marker.appearAnimation = kGMSMarkerAnimationPop;
    marker.icon = [self makeAnnotationImage:annotation];
    marker.title = [annotation getInitials];
    marker.snippet = [annotation getTimeLabel];
    marker.annotation = annotation;
    marker.groundAnchor = CGPointMake(0.5, 0.5);
    marker.map = mapView_;
}
{% endhighlight %}

### Groups

<div class="image-feature">
  <img src="/projects/ketch/ketch-groups.gif">
  <div class="caption"> Using groups </div>
</div>

We tried to position ourselves group-chat-adjacent. A use case was athletes at Northwestern. They need to log a certain number of hours at the gym each week and tend to prefer to do this with each other. If your entire sports team could see that you were going to the gym they could join you.

We wanted to be able to approach Greek organizations the same way. The idea was that these are people you have a sort of social safety net with—if you see them in the student center or at a dining hall you can probably join in with low barrier. The only barrier is not knowing that someone else is free which is what Ketch wanted to accomplish.

This was solved by creating groups within the app. I implemented a many-to-many relation between `users` through `groups`, essentially a collection of your friends. Some were defined by users specifically, others were defined based off of email (Northwestern group), and eventually others would have been created for fraternities/sororities/sports teams/your Dungeons and Dragons party.

### Room For Improvement

I can look through the code and see the progression of me actually learning Objective-C. Here's an example:

{% highlight objective-c %}
- (void)viewWillDisappear:(BOOL)animated {
    [self.navigationController setToolbarHidden:YES];
    if ([self.navigationController.viewControllers indexOfObject:self]==NSNotFound) {
        NSInteger numberOfViewControllers = self.navigationController.viewControllers.count;
        MapViewController *destinationVC =
          (MapViewController *)[self.navigationController.viewControllers
                                objectAtIndex:numberOfViewControllers - 1];

        destinationVC.friendList=_friendList;
        [destinationVC updateSubview];
    }

    [self exitButton];

    [super viewWillDisappear:animated];
}
{% endhighlight %}

I'm trying to find the main view controller, `MapViewController`, by counting the total view controllers, indexing into the view controllers, casting to the type I want, then calling a method on that view controller to update the UI. It's gross and there's no logical separation between which class is implementing the logic of which.

Here's an example from months later:

{% highlight c %}
// in Blurb class
- (IBAction)donePressed:(id)sender
{
    self.blurb = self.blurbField.text;

    [self.delegate dismissBlurbField:self.blurb];
}

...
// in MapViewController class
- (void)dismissBlurbField:(NSString *)blurb
{
    [self close:nil];
    _blurb = blurb;
    if ([_blurb length]) {
        [self.eventCreateSubview.blurbImageView setImage:[UIImage imageNamed:@"filledspeech95.png"]];
    } else {
        [self.eventCreateSubview.blurbImageView setImage:[UIImage imageNamed:@"speech95.png"]];
    }
}
{% endhighlight %}

I created a `BlurbCalloutViewControllerDelegate` protocol which allowed me to cleanly dismiss the blurb field then update the UI from inside `MapViewController`.

The `MapViewController` is where the logic for updating its view should be, so this makes far more sense.

In the end, the [repository](https://github.com/anderoonies/CheckItiOS) is bloated and sprawling. `MapViewController` is 800 lines long, full of work-arounds and hacks that I did to try to get things done on deadlines. It's still amazing to me, though, that the app _worked_. The product didn't work, but the events hit the database and push notifications ended up being sent. I feel skeptical looking at the slop-job I had to do with Ketch and thinking about how clean professional apps must be.

Next, not making it.

### Not Making It

Ketch, of course, wasn't the next big thing. I can blame this on the un-ideal team or whatever else, but the truth is this was probably never going to succeed. That sucks, given that it was my idea to start with and I put _so many_ hours into Ketch.

As soon as NUvention finished, Ketch stopped existing. The Facebook page still gets a like every once in a while. A person _somehow_ finds the Facebook page and, thinking it's some social network they've never heard of, likes it. Our customer segment, now, is one stranger every 4 weeks.

## So What?

I got a lot out of Ketch. I've learned what a small start-up is like, I've learned what "agile development" means, I've learned what a dysfunctional team is like, I've learned iOS development.

I got a good profile picture from the final pitch.

<div class="image-feature">
  <img src="/about/me.png" align="center" width="100%">
</div>
