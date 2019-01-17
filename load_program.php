<?php
/**
 * Created by PhpStorm.
 * User: ekim
 * Date: 2018-12-14
 * Time: 18:59
 */

require __DIR__ . '/vendor/autoload.php';

$program_source = file_get_contents( "./programs/" . $_GET["program_name"] );

$pos = new \StanfordNLP\POSTagger(
  __DIR__ . '/stanford-postagger-2018-10-16/models/english-left3words-distsim.tagger',
  __DIR__ . '/stanford-postagger-2018-10-16/stanford-postagger.jar'
);

$pos->setDebug( false );

$lines = preg_split( "/(\r\n|\n|\r)/", $program_source );

$source_lines = [];
foreach ( $lines as $line ) {
  array_push($source_lines, explode( ' ', $line . "."));
}

//var_dump($source_lines);

$source_lines2 = $pos->batchTag($source_lines);

//var_dump($source_lines2);

//foreach ( $lines as $line ) {
//  $result         = $pos->tag( explode( ' ', $line ) );
//  $source_lines[] = (object) array( "raw" => $line, "parsed" => $result );
//}

echo json_encode( $source_lines2 );