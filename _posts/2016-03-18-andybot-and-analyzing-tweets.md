---
layout: post
title:  "AndyBot And Analyzing My Tweets"
---

I spent last night with Python's [`nltk`](http://www.nltk.org/)—my initial focus was seeing if I could make [AndyBot]({{site.url}}/projects/andybot) smarter/more coherent. The results weren't great—a trained Hidden Markov Model produced equally incoherent sentences as the current random algorithm ("would friend do noodle using melting sibelius?"). Instead I used some of the analysis tools in `nltk` to view trends in my own tweets.

## Organizing The Corpus

The first step was creating a corpus of words for analysis—iterating through tweets and using the `nltk.pos_tag` to tag the parts of speech in each of them.

{% highlight python %}
for tweet in tweets:
  tweet_tokens = nltk.word_tokenize(tweet.decode('utf-8'))
  tweet_tags = nltk.pos_tag(tweet_tokens)
  corpus += [nltk.pos_tag(tweet_tokens)]
{% endhighlight %}

The result of one of these tagged tweets looks something like this:
{% highlight python %}
[
 ('[', 'NN'),
 ('puts', 'VBZ'),
 ('on', 'IN'),
 ('live', 'JJ'),
 ('album', 'NN'),
 ('and', 'CC'),
 ('stands', 'VBZ'),
 ('in', 'IN'),
 ('apartment', 'NN'),
 ('tapping', 'VBG'),
 ('foot', 'NN'),
 ('for', 'IN'),
 ('2', 'CD'),
 ('hours', 'NNS'),
 (']', 'VBP')
]
{% endhighlight %}

## What I Talk About

I analyzed the corpus for the most common things I say.

{% highlight python %}
# iterate over the tagged text to find given prefix
def findtags(tag_prefix, tagged_text):
  cfd = nltk.ConditionalFreqDist((tag, word) for (word, tag) in tagged_text
                                  if tag.startswith(tag_prefix))
  return dict((tag, cfd[tag].most_common(10)) for tag in cfd.conditions())
{% endhighlight %}

### Nouns:
{% highlight python %}
('NN',
  [('i', 519),
   ('http', 180),
   ('time', 78),
   ('someone', 66),
   ('https', 48),
   ('life', 45),
   ('day', 39),
   ('everyone', 36),
   ('man', 35),
   ('guy', 34)]
)
('NNP',
  [(']', 16),
   ('@', 15),
   ('TO', 13),
   ('Andy', 11),
   ('[', 10),
   ('A', 8),
   ('THE', 7),
   ('THIS', 7),
   ('IN', 7),
   ('My', 6)]
)
('NNS',
  [('i', 76),
   ('people', 69),
   ('things', 33),
   ('hours', 20),
   ('pants', 19),
   ('thanks', 17),
   ('minutes', 16),
   ('girls', 14),
   ('guys', 12),
   ('days', 12)]
)
{% endhighlight %}

There are clearly some issues with parsing tweets—'@', '[' and ']' are perceived as proper nouns and 'i' is perceived as plural in 76 cases.

My pronouns are also clearly skewed in terms of gender. I checked common contexts between 'guy' and 'girl'.

{% highlight python %}
>>> tweet_text.common_contexts(['guy', 'girl'])
    the_who a_with
{% endhighlight %}

[('chuck', 'e', 'cheese'), ('Now', "That's", 'What'), ('What', 'I', 'Call'), ("That's", 'What', 'I'), ("it's", 'not', 'delivery'), ('getting', 'married', 'and'), ('married', 'and', 'having'), ('my', 'water', 'bottle'), ('the', 'dining', 'hall'), ('the', 'police', 'come')]


### Verbs:
{% highlight python %}
('VB',
  [('be', 156),
   ('have', 66),
   ('get', 59),
   ('i', 55),
   ('do', 54),
   ('know', 41),
   ('make', 33),
   ('see', 31),
   ('think', 27),
   ('say', 23)]
)
('VBD',
  [('was', 91),
  ('did', 34),
  ('were', 33),
  ('had', 32),
  ('got', 29),
  ('made', 24),
  ('said', 22),
  ('put', 18),
  ('saw', 12),
  ('thought', 12)]
)
{% endhighlight %}
