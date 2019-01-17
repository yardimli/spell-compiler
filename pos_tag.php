<?php
/**
 * Created by PhpStorm.
 * User: ekim
 * Date: 2019-01-15
 * Time: 20:22
 */
require __DIR__ . '/vendor/autoload.php';

$pos = new \StanfordNLP\POSTagger(
  __DIR__ . '/stanford-postagger-2018-10-16/models/english-left3words-distsim.tagger',
  __DIR__ . '/stanford-postagger-2018-10-16/stanford-postagger.jar'
);

$pos->setDebug(false);

$result = $pos->tag(explode(' ', "What does the fox say?"));
echo $result;


var_dump([explode(' ', "What does the fox say?"), explode(' ', "What does the parrot say?")]);

$results = $pos->batchTag([explode(' ', "What does the fox say?"), explode(' ', "What does the parrot say?")]);
var_dump($results);

//var_dump($result);