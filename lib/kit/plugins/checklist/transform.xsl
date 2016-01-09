<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="xml" indent="no" omit-xml-declaration="yes" />
  
  <xsl:template match="checklist">
    <a name="{@id}"></a>
    <ul>
      <xsl:for-each select="item">
	<li><xsl:apply-templates /></li>
      </xsl:for-each>
    </ul>
  </xsl:template>
    
  <xsl:template match="@*|node()">
    <xsl:copy>
      <xsl:apply-templates select="@*|node()"/>
    </xsl:copy>
  </xsl:template>
  
</xsl:stylesheet>
