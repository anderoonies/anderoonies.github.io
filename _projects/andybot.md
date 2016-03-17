---
title: AndyBot
layout: page
photo_url: /projects/andybot.png
---


<img src="/projects/andybot.png" width="35%" align="right">

# AndyBot

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">what daddy likes!!</p>&mdash; AndyBot (@ANDO_3000) <a href="https://twitter.com/ANDO_3000/status/699254362879758336">February 15, 2016</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

AndyBot's a well-intentioned Twitter bot that uses a Markov chain to generate tweets based off of my own.

The process is scraping my own tweets, generation the Markov chain, then hitting the Twitter API with it.

AndyBot's word choices are represented as a dictionary mapping tuples of two words to candidates of words that could follow. That looks something like this:

{% highlight python %}
('i', 'figure'): ['the'],
('quartet', 'sounds'): ['like'],
('aid', 'check'): ['them'],
('banjo', 'so'): ['your'],
('no', 'hands'): ['thinking'],
('takes', 'himself'): ['way'],
('you', 'die'): ['you', 'in', 'all']
{% endhighlight %}

The generation is pretty simple:

{% highlight python %}
word1, word2 = word2, random.choice(self.dict[(word1, word2)])
{% endhighlight %}

The next word word is chosen based off of the two most recent words. The process repeats until a natural ending point is reached or the bot runs out of its 140 characters.

Despite his good intentions, AndyBot makes mistakes. I haven't taught him not to tweet at people. A few times he's @ mentioned people I haven't talked in years and in other cases confused customer support people.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/ANDO_3000">@ANDO_3000</a> Please clarify your tweet. ^CP</p>&mdash; United (@united) <a href="https://twitter.com/united/status/562880943506325505">February 4, 2015</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>

AndyBot forces me to recognize how predictable and stupid all of my tweets are, something I appreciate.
